<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class VersionController extends Controller
{
    /**
     * GET /version: version of the running backend image.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => [
                'name' => config('app.name'),
                'version' => config('app.version'),
            ],
        ]);
    }
}
