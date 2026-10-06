@extends('layouts.app')
@section('title', 'Something went wrong')
@section('full')
<div class="error-page container">
    <div class="code">500</div>
    <h1>Something went wrong</h1>
    <p class="muted">An unexpected error occurred. Please try again in a moment.</p>
    <div class="row" style="justify-content:center">
        <a href="{{ url()->previous() !== url()->current() ? url()->previous() : route('home') }}" class="btn btn-outline"><x-icon name="arrow-left" /> Go back</a>
        <a href="{{ route('home') }}" class="btn btn-primary">Home</a>
    </div>
</div>
@endsection
