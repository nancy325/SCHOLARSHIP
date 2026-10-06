<?php

namespace App\Support;

/**
 * Shared option lists used by forms, validation and eligibility matching.
 */
class Options
{
    public const EDUCATION_LEVELS = [
        'high-school' => 'School (Class 9–12)',
        'diploma' => 'Diploma / ITI / Polytechnic',
        'undergraduate' => 'Undergraduate (UG)',
        'postgraduate' => 'Postgraduate (PG)',
        'phd' => 'PhD / Research',
        'other' => 'Other',
    ];

    public const SOCIAL_CATEGORIES = [
        'general' => 'General',
        'ews' => 'EWS',
        'obc' => 'OBC / SEBC',
        'sc' => 'SC',
        'st' => 'ST',
        'minority' => 'Minority',
    ];

    public const GENDERS = [
        'female' => 'Female',
        'male' => 'Male',
        'other' => 'Other',
    ];

    public const AWARD_FREQUENCIES = [
        'one_time' => 'one-time',
        'per_year' => 'per year',
        'per_month' => 'per month',
    ];

    public const STATES = [
        'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
        'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
        'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    ];

    public static function states(): array
    {
        return array_combine(self::STATES, self::STATES);
    }

    /** Format rupees the Indian way: 250000 -> ₹2,50,000 */
    public static function rupees(?int $amount): string
    {
        if ($amount === null) {
            return '—';
        }
        $s = (string) $amount;
        if (strlen($s) > 3) {
            $last3 = substr($s, -3);
            $rest = substr($s, 0, -3);
            $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest);
            $s = $rest . ',' . $last3;
        }

        return '₹' . $s;
    }

    /** 250000 -> "₹2.5 lakh" */
    public static function lakh(?int $amount): string
    {
        if ($amount === null) {
            return '—';
        }
        if ($amount >= 100000) {
            $l = round($amount / 100000, 2);
            return '₹' . rtrim(rtrim(number_format($l, 2), '0'), '.') . ' lakh';
        }

        return self::rupees($amount);
    }
}
