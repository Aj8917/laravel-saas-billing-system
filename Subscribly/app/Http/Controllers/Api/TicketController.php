<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $vendorId = $user->parent_id ? $user->parent_id : $user->id;
        try {

            $perPage = $request->get('per_page', 50);
            $search = $request->get('search');
            $query = Ticket::with('user');
            if ($user->role_id !== 1) {
                $query->where('user_id', $vendorId);
            }
            $query->orderBy('created_at', 'desc');

            if (!empty($search)) {
                $query->where('ticket_no', 'like', '%' . $search . '%');
            }
            $tickets = $query->paginate($perPage);

            return response()->json($tickets);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching tickets', 'error' => $e->getMessage()], 500);

        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $validated = $request->validate([
            // 'ticket_no'   => 'required|unique:tickets,ticket_no',
            // 'user_id'     => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'category' => 'required|in:billing,technical',
            'description' => 'nullable|string',
            'status' => 'in:open,in_progress,resolved,closed',
            'priority' => 'required|in:low,medium,high',
        ]);
        $ticket = $user->tickets()->create($validated);
        //$ticket = Ticket::create($validated);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket
        ], 201);
    }
    public function update(Request $request, Ticket $ticket)
    {
        try {
            // Strict validation (matches ENUM)
            $validated = $request->validate([
                'status' => [
                    'required',
                    Rule::in(['open', 'in_progress', 'resolved', 'closed'])
                ]
            ]);

            // Update safely
            $ticket->update([
                'status' => $validated['status']
            ]);

            return response()->json([
                'message' => 'Status updated successfully'
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {

            //  Validation error (user mistake)
            return response()->json([
                'message' => 'Invalid status value',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {

            // 🔒 Log real error (hidden from user)
            \Log::error('Ticket update failed', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticket->id
            ]);

            return response()->json([
                'message' => 'Something went wrong. Please try again later.'
            ], 500);
        }
    }
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully'
        ]);
    }


}
