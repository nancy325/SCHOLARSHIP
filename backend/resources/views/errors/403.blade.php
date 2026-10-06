@extends('layouts.app')
@section('title', 'Access denied')
@section('full')
<div class="error-page container">
    <div class="code">403</div>
    <h1>Access denied</h1>
    <p class="muted">{{ $exception?->getMessage() ?: 'You do not have permission to view this page.' }}</p>
    <div class="row" style="justify-content:center">
        <a href="{{ url()->previous() !== url()->current() ? url()->previous() : route('home') }}" class="btn btn-outline"><x-icon name="arrow-left" /> Go back</a>
        <a href="{{ route('home') }}" class="btn btn-primary">Home</a>
    </div>
</div>
@endsection
