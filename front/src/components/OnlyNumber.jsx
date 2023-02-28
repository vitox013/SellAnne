export function onlyNumber(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    e.target.value = value;
    return e;
}
