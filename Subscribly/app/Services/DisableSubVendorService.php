<?php

namespace App\Services;


use App\Models\Subscriptions;
use App\Models\Tenant;
use App\Models\TenantUserAccess;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DisableSubVendorService
{

    public function disableUser(int $tenantId, string $reason): void
    {
        $subscription = Subscriptions::where('tenant_id', $tenantId)
            ->where('status', '!=', 'expired')
            ->latest('created_at')
            ->first();

        if ($subscription) {
            $subscription->update([
                'status' => 'expired',
            ]);
        }

        TenantUserAccess::where('tenant_id', $tenantId)
            ->where('status', '!=', 'suspended')
            ->update([
                'status' => 'suspended',
                'reason' => $reason,
            ]);
    }

}//DisableSubVendorService