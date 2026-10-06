<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PageController extends Controller
{
    /** Home page: every active scholarship from the database, with filters */
    public function home(Request $request, ScholarshipController $scholarships)
    {
        $data = $scholarships->listing($request, false);

        $data['stats'] = [
            'scholarships' => Scholarship::where('RecStatus', 'active')->count(),
            'open' => Scholarship::where('RecStatus', 'active')->whereDate('deadline', '>=', today())->count(),
            'universities' => University::where('RecStatus', 'active')->count(),
            'institutes' => Institute::where('RecStatus', 'active')->count(),
            'students' => User::where('role', 'student')->where('RecStatus', 'active')->count(),
        ];

        return view('pages.home', $data);
    }

    public function about()
    {
        return view('pages.about');
    }

    public function faqs()
    {
        return view('pages.faqs', ['faqs' => config('faqs')]);
    }

    public function contact(Request $request)
    {
        return view('pages.contact', ['user' => $request->user()]);
    }

    public function submitContact(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'feedback_type' => ['required', Rule::in(Feedback::TYPES)],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ]);

        $data['user_id'] = $request->user()?->id;
        Feedback::create($data);

        return redirect()->route('contact')->with('success', 'Thank you! Your message has been sent. We will get back to you soon.');
    }
}
