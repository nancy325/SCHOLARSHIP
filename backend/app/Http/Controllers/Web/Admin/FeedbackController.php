<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::query()->with('user:id,name');

        if (in_array($type = $request->query('type'), Feedback::TYPES, true)) {
            $query->where('feedback_type', $type);
        }

        return view('admin.feedback.index', [
            'feedback' => $query->latest()->paginate(15)->withQueryString(),
            'type' => $type,
        ]);
    }
}
