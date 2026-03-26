<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Auth;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $vendorId = $user->parent_id ? $user->parent_id : $user->id;
        try {

            $perPage = $request->get('per_page', 50);
            $search = $request->get('search');
            $query = Ticket::with('user')
                ->where('user_id', $vendorId)
                ->orderBy('created_at', 'desc');

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
            'subject'     => 'required|string|max:255',
            'category'    => 'required|in:billing,technical',
            'description' => 'nullable|string',
            'status'      => 'in:open,in_progress,resolved,closed',
            'priority'    => 'required|in:low,medium,high',
        ]);
        $ticket = $user->tickets()->create($validated);
        //$ticket = Ticket::create($validated);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket'  => $ticket
        ], 201);
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully'
        ]);
    }


}
