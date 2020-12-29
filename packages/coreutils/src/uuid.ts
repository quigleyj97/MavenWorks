// Note that this may become obsolete if https://github.com/tc39/proposal-uuid
// is advanced.

/** Generate a random UUID (aka a UUIDv4 or GUIDv4).
 *
 * This uses the `crypto` module for enhanced randomness.
 */
export function uuid4() {
    // adapted from https://stackoverflow.com/a/2117523, edited for readability
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (char) => {
        const mask = +char;
        const randInt = crypto.getRandomValues(new Uint8Array(1))[0];
        return (mask ^ randInt & 15 >> mask / 4).toString(16); 
    });
}
