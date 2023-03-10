module.exports = (userName, url) => {
    const text = `<div>
                <h3>
                    Olá, <strong>${userName}</strong>!
                </h3>
                <p>
                    Para acessar nosso serviço é necessário verificar seu
                    email.
                </p>
                <p>É muito simples, clique no botão abaixo:</p>
                <button style="padding: 0.7em; background-color: #2b961f; border-radius: 10px; border:none ;">
                    <a
                        href="${url}"
                        style="text-decoration: none; color: white"
                    >
                       Verifique seu email!
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
