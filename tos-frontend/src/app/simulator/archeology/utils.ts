
// IMCRandom logic (same as in-game logic)
// Returns an integer between min and max (inclusive)
export function IMCRandom(min: number, max: number): number {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// IMCRandomFloat logic (same as in-game logic)
// Returns a float between min and max
export function IMCRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

// Check if a number is an integer
export function isInteger(n: number): boolean {
    if (typeof n !== 'number') return false;
    if (isNaN(n)) return false;
    return n % 1 === 0;
}

// Weight-based random selection algorithm (exactly reproducing calc_weight_base_random)
export function calcWeightBaseRandom<T extends { weight: number }>(
    pools: T[],
    pickcount: number
): { item: T; value: number }[] {
    const weightlist: { item: T; weight: number }[] = [];
    const results: { item: T; value: number }[] = [];

    // For each option, calculate U = random(0, 1), V = U^(1/Weight)
    for (let i = 0; i < pools.length; i++) {
        const opt_data = pools[i];
        const Weight = opt_data.weight;
        let U = IMCRandomFloat(0, 1);

        // If U is less than or equal to 0, set to 0.00001
        if (U <= 0) {
            U = 0.00001;
        }

        // V = U^(1/Weight)
        const V = Math.pow(U, 1 / Weight);

        weightlist.push({
            item: opt_data,
            weight: V,
        });
    }

    // Sort by V in descending order
    weightlist.sort((a, b) => b.weight - a.weight);

    // Select top N items
    for (let i = 0; i < weightlist.length; i++) {
        if (i >= pickcount) {
            break;
        }

        const { item } = weightlist[i];

        // Check if item has MinValue and MaxValue properties for value rolling
        const itemWithValues = item as unknown as { MinValue?: number; MaxValue?: number };
        const min_val = itemWithValues.MinValue;
        const max_val = itemWithValues.MaxValue;
        let rolled_value = 0;

        if (min_val !== undefined && max_val !== undefined) {
            // Logic same as Lua code: call IMCRandom first
            rolled_value = IMCRandom(min_val, max_val);

            // If not integer, use IMCRandomFloat (same as Lua code)
            if (!isInteger(min_val) || !isInteger(max_val)) {
                rolled_value = IMCRandomFloat(min_val, max_val);
                // Round to 2 decimal places for display niceness if it's a float
                rolled_value = Math.round(rolled_value * 100) / 100;
            }
        }

        results.push({ item, value: rolled_value });
    }

    return results;
}
