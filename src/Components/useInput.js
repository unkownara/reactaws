import { useState } from 'react';

export function useInput(inititalValue) {
    const [value, setValue] = useState(inititalValue);
    function onChangeHandler(e) {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: onChangeHandler
    }
}