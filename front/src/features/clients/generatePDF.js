import { jsPDF } from "jspdf";
import { toBRL } from "../../utils/currency";
// Default export is a4 paper, portrait, using millimeters for units
const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function generatePDF(cliente, pedidos) {
    const doc = new jsPDF();

    var linha = 50;
    var total = 0;
    doc.setFont("helvetica", "bold");

    doc.text(`Relatório de pedidos`, 10, 20);
    doc.text(`Cliente: ${cliente}`, 10, 30);
    doc.text(`Cód`, 10, 40);
    doc.text(`Nome produto`, 40, 40);
    doc.text(`Qtd`, 110, 40);
    doc.text(`Valor un.`, 130, 40);
    doc.text(`Valor já pago`, 165, 40);
    doc.setFont("Helvetica", "regular");
    pedidos.map((pedido) => {
        doc.text(`${pedido.codigoProduto}`, 10, linha);
        doc.text(`${pedido.nomeProduto}`, 40, linha);
        doc.text(`${pedido.quantidade}`, 112, linha);
        doc.text(`${formatter.format(pedido.valor.toFixed(2))}`, 130, linha);
        doc.text(`${formatter.format(pedido.qtdPaga.toFixed(2))}`, 170, linha);
        linha += 10;
        total += pedido.valor * pedido.quantidade;
    });
    doc.setFont("helvetica", "bold");
    doc.text(`Quantidade de pedidos: ${pedidos.length}`, 10, linha + 10);
    doc.text(
        `Valor total: ${formatter.format(total.toFixed(2))}`,
        140,
        linha + 10
    );
    doc.save(`relatorio-${cliente}.pdf`);
}
