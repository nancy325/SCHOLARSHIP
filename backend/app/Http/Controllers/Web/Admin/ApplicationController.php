<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\ScholarshipApplication;
use App\Services\ProfileService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApplicationController extends Controller
{
    use Concerns;

    public function index(Request $request)
    {
        $query = $this->applicationsFor($request->user())
            ->with(['user:id,name,email,category', 'scholarship:id,title,type,deadline']);

        $status = $request->query('status', 'pending');
        if (in_array($status, ScholarshipApplication::STATUSES, true)) {
            $query->where('application_status', $status);
        }
        if ($scholarshipId = $request->integer('scholarship')) {
            $query->where('scholarship_id', $scholarshipId);
        }
        if ($search = $request->query('search')) {
            $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }

        $counts = $this->applicationsFor($request->user())
            ->selectRaw('application_status, count(*) as total')
            ->groupBy('application_status')
            ->pluck('total', 'application_status');

        return view('admin.applications.index', [
            'applications' => $query->latest('application_date')->paginate(15)->withQueryString(),
            'status' => $status,
            'counts' => $counts,
        ]);
    }

    public function show(Request $request, ScholarshipApplication $application, ProfileService $profiles)
    {
        $this->authorizeApplication($request, $application);
        $application->load(['user', 'scholarship.university', 'scholarship.institute', 'reviewer:id,name']);

        return view('admin.applications.show', [
            'application' => $application,
            'profile' => $profiles->getProfile($application->user),
        ]);
    }

    public function update(Request $request, ScholarshipApplication $application)
    {
        $this->authorizeApplication($request, $application);

        if ($application->application_status === 'withdrawn') {
            return back()->with('error', 'This application was withdrawn by the student and cannot be reviewed.');
        }

        $data = $request->validate([
            'application_status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'admin_remarks' => ['nullable', 'string', 'max:2000', 'required_if:application_status,rejected'],
        ], [
            'admin_remarks.required_if' => 'Please give the student a reason when rejecting an application.',
        ]);

        $application->update($data + [
            'status_updated_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()->route('admin.applications.show', $application)
            ->with('success', 'Application marked as ' . $data['application_status'] . '.');
    }

    private function authorizeApplication(Request $request, ScholarshipApplication $application): void
    {
        abort_unless(
            $this->applicationsFor($request->user())->whereKey($application->id)->exists(),
            403,
            'You cannot review this application.'
        );
    }
}
