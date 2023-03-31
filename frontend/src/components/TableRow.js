const TableRow = ({ prod, btn }) => {
    let devs = prod.developers.toString().replace(/,/g, ', ');

    return (
        <tr>
            <td>{prod.productId}</td>
            <td>{prod.productName}</td>
            <td>{prod.productOwnerName}</td>
            <td>{devs}</td>
            <td>{prod.scrumMasterName}</td>
            <td>{prod.startDate}</td>
            <td>{prod.methodology}</td>
            <td className="btn">
                <button
                    className="edit-btn"
                    id="edit-btn"
                    onClick={() => {
                        btn(prod);
                    }}
                >
                    EDIT
                </button>
            </td>
        </tr>
    );
};

export default TableRow;
