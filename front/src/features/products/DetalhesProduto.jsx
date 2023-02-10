import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetProductsQuery } from "./productsApiSlice";
import { useState } from "react";

const DetalhesProduto = () => {
    const { id: productId } = useParams();
    const { userId } = useAuth();
    const [content, setContent] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [estoque, setEstoque] = useState("");
    const [produto, setProduto] = useState("");
    const [preco, setPreco] = useState("");

    const { products } = useGetProductsQuery(userId, {
        selectFromResult: ({ data }) => ({
            products: data?.entities[productId],
        }),
    });

    console.log(products);

    useEffect(() => {
        if (products) {
            setCodigo(products.codigo);
            setEstoque(products.estoque);
            setPreco(products.preco);
            setProduto(products.produto);
        }
    }, [products]);

    return <></>;
};

export default DetalhesProduto;
