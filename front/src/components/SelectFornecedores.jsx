import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDataQuery } from "../features/users/userApiSlice";
import useAuth from "../hooks/useAuth";
import { Col, Form, FormSelect, Row } from "react-bootstrap";
import { setSelectedOption } from "../reducers/selectedOption";

const SelectFornecedores = () => {
    const { userId } = useAuth();
    const [options, setOptions] = useState([]);
    const { selectedOption } = useSelector((state) => state.selectedOption);
    const dispatch = useDispatch();

    const { fornecedores, isSuccess } = useGetUserDataQuery(userId, {
        selectFromResult: ({ data, isSuccess }) => ({
            fornecedores: data?.fornecedores,
            isSuccess,
        }),
    });

    useEffect(() => {
        if (isSuccess && fornecedores?.length > 0) {
            setOptions(
                fornecedores.map((forn) => (
                    <option key={forn._id} value={forn.nomeFornecedor}>
                        {forn.nomeFornecedor}
                    </option>
                ))
            );
        }
    }, [isSuccess]);

    const onHandleSetSelectedOption = (e) => {
        dispatch(setSelectedOption(e.target.value));
    };

    return (
        <Row>
            <Col xs={7}>
                <Form>
                    <FormSelect
                        onChange={onHandleSetSelectedOption}
                        value={selectedOption}
                    >
                        <option value="Todos">Todos</option>
                        {options}
                    </FormSelect>
                </Form>
            </Col>
        </Row>
    );
};

export default SelectFornecedores;
