@if ($paginator->hasPages())
    <nav aria-label="Pagination">
        <ul class="pagination">
            @if ($paginator->onFirstPage())
                <li class="disabled"><span>&lsaquo; Prev</span></li>
            @else
                <li><a href="{{ $paginator->previousPageUrl() }}" rel="prev">&lsaquo; Prev</a></li>
            @endif

            @foreach ($elements as $element)
                @if (is_string($element))
                    <li class="disabled"><span>{{ $element }}</span></li>
                @endif
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li class="active" aria-current="page"><span>{{ $page }}</span></li>
                        @else
                            <li><a href="{{ $url }}">{{ $page }}</a></li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            @if ($paginator->hasMorePages())
                <li><a href="{{ $paginator->nextPageUrl() }}" rel="next">Next &rsaquo;</a></li>
            @else
                <li class="disabled"><span>Next &rsaquo;</span></li>
            @endif
        </ul>
        <p class="pagination-info">Showing {{ $paginator->firstItem() }}–{{ $paginator->lastItem() }} of {{ $paginator->total() }}</p>
    </nav>
@endif
