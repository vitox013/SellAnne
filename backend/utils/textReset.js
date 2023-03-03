module.exports = (userName, url) => {
    const text = `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <h3>
                    Olá, <strong>${userName}</strong>!
                </h3>
                <p>Clique no botão abaixo para resetar sua senha:</p>
                <button style="padding: 0.7em; background-color: #2b961f; border-radius: 10px; border:none ;">
                    <a
                        href="${url}"
                        style="text-decoration: none; color: white"
                    >
                       Altere sua senha!
                    </a>
                </button>
                <p>
                    Caso não consiga clicando logo acima, é só copiar e
                    colar o link abaixo em seu navegador:
                </p>
                <p>
                    <a
                        href="${url}"
                    >
                        ${url}
                    </a>
                </p>
                <p>
                    <p>SellAnne &reg;</p>
                </p>
            </div>`;
    return text;
};
