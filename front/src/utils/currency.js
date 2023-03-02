export function toNumber(value) {
    let number = value.toString();
    number = number.replace(".", "");
    number = number.replace(",", ".");

    return Number(number);
}

export function toBRL(number) {
    let value = number.toString();
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
}

export function currency(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");

    e.target.value = value;
    return e;
}
