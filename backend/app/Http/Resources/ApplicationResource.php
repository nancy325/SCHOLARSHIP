<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'scholarship_id' => $this->scholarship_id,
            'applied_at' => $this->applied_at?->toISOString(),
            
            // Relationships
            'scholarship' => $this->when($this->relationLoaded('scholarship'), function () {
                return [
                    'id' => $this->scholarship->id,
                    'title' => $this->scholarship->title,
                    'type' => $this->scholarship->type,
                    'deadline' => $this->scholarship->deadline?->format('Y-m-d'),
                    'apply_link' => $this->scholarship->apply_link,
                ];
            }),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}