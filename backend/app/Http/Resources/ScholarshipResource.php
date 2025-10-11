<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScholarshipResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'university_id' => $this->university_id,
            'institute_id' => $this->institute_id,
            'eligibility' => $this->eligibility,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'deadline' => $this->deadline?->format('Y-m-d'),
            'apply_link' => $this->apply_link,
            'created_by' => $this->created_by,
            
            // Relationships
            'university' => $this->when($this->relationLoaded('university'), function () {
                return [
                    'id' => $this->university->id,
                    'name' => $this->university->name,
                ];
            }),
            'institute' => $this->when($this->relationLoaded('institute'), function () {
                return [
                    'id' => $this->institute->id,
                    'name' => $this->institute->name,
                ];
            }),
            'creator' => $this->when($this->relationLoaded('creator'), function () {
                return [
                    'id' => $this->creator->id,
                    'name' => $this->creator->name,
                ];
            }),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

