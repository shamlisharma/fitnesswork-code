import {graphDataTypes} from '../_action/GraphDataAction';

const initialState = {
  sleepGraphData: {
    oneWeekAvg: '',
    oneMonthAvg: '',
    threeMonthAvg: '',
    oneWeekList: [],
    oneMonthList: [],
    threeMonthList: [],
    oneMonthDates: [],
    threeMonthDates: []

  },
};

export function graphDataReducer(state = initialState, action) {
  switch (action.type) {
    case graphDataTypes.STORE_SLEEP_GRAPH_DATA:
   
    let dummyData = {};
    const { dataType, data } = action.payload;
    switch(dataType) {
        case 'weeklist':
            dummyData = { ...state.sleepGraphData, oneWeekList: data }; 
            break;
            case '1monthlist':
            dummyData = { ...state.sleepGraphData, oneMonthList: data }; 
            break;
            case '3monthlist':
            dummyData = { ...state.sleepGraphData, threeMonthList: data }; 
            break;
            case '3monthAvg':
            dummyData = { ...state.sleepGraphData, threeMonthAvg: data }; 
            break;
            case '1monthAvg':
            dummyData = { ...state.sleepGraphData, oneMonthAvg: data }; 
            break;
            case 'weekavg':
            dummyData = { ...state.sleepGraphData, oneWeekAvg: data }; 
            break;
            case '1monthDates':
            dummyData = { ...state.sleepGraphData, oneMonthDates: data }; 
            break;
            case '3monthDates':
            dummyData = { ...state.sleepGraphData, threeMonthDates: data }; 
            break;
            
        
    }
    

    return {
        ...state, 
        sleepGraphData: dummyData
      };
    default:
      return {...state};
  }
}
