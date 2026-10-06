@extends('layouts.app')
@section('title', 'Page expired')
@section('full')
<div class="error-page container">
    <div class="code">419</div>
    <h1>Page expired</h1>
    <p class="muted">Your session expired. Please go back, refresh the page and try again.</p>
    <div class="row" style="justify-content:center">
        <a href="{{ url()->previous() !== url()->current() ? url()->previous() : route('home') }}" class="btn btn-outline"><x-icon name="arrow-left" /> Go back</a>
        <a href="{{ route('home') }}" class="btn btn-primary">Home</a>
    </div>
</div>
@endsection
