exports.romanToInt = (roman) => {
    const romanMap = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };

    let total = 0;

    for (let i = 0; i < roman.length; i++) {  // ✅ Use `roman` instead of `s`
        let current = romanMap[roman[i]];
        let next = romanMap[roman[i + 1]] || 0;  // ✅ Prevent `undefined` error

        if (current < next) {
            total -= current;
        } else {
            total += current;
        }
    }

    return total;
};
