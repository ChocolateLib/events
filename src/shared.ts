//Checks if object is empty
export function objectCheckNotEmpty(object: {}) {
    for (const key in object) {
        return true;
    }
    return false;
}