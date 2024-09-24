
export const graphDataTypes = {
    STORE_SLEEP_GRAPH_DATA: 'STORE_SLEEP_GRAPH_DATA',
};

const storeSleepGraphData = (dataType, data) => ({
    type: graphDataTypes.STORE_SLEEP_GRAPH_DATA,
    payload: { dataType, data }
});

export { storeSleepGraphData };
