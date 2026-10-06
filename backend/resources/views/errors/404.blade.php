@extends('layouts.app')
@section('title', 'Page not found')
@section('full')
<div class="error-page container">
    <div class="code">404</div>
    <h1>Page not found</h1>
    <p class="muted">The page you are looking for doesn’t exist or has been moved.</p>
    <div class="row" style="justify-content:center">
        <a href="{{ url()->previous() !== url()->current() ? url()->previous() : route('home') }}" class="btn btn-outline"><x-icon name="arrow-left" /> Go back</a>
        <a href="{{ route('home') }}" class="btn btn-primary">Home</a>
    </div>
</div>
@endsection
