export function telefoneMask(e) {
    let value = e.target.value;

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})(\d{4})$/, "$1 $2-$3");
    e.target.value = value;
    return e;
}
