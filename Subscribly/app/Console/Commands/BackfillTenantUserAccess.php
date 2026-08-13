<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;

class BackfillTenantUserAccess extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:backfill-tenant-user-access';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create tenant user access records for existing subvendors';

    /**
     * Execute the console command.
     */
    public function handle()
    {
         $this->info('Starting tenant user access backfill...');

        $count = 0;
        DB::table('users')
            ->whereNotNull('parent_id')
            ->select('id', 'tenant_id')
            ->orderBy('id')
            ->chunkById(500, function ($users) use (&$count) {

                $data = [];

                foreach ($users as $user) {
                    $data[] = [
                        'tenant_id' => $user->tenant_id,
                        'user_id' => $user->id,
                        'status' => 'active',
                        'reason' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($data)) {
                    DB::table('tenant_user_access')->insertOrIgnore($data);

                    $count += count($data);
                }
            });

        $this->info("Backfill completed. {$count} records processed.");

        return self::SUCCESS;
    }
}
