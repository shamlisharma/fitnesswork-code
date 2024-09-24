
export const commonTypes = {
    UPDATE_COLLAPSABLE_CONTAINER_STATUS: 'UPDATE_COLLAPSABLE_CONTAINER_STATUS',
    UPDATE_ALL_WORKOUT_PAGE_NAME: 'UPDATE_ALL_WORKOUT_PAGE_NAME' 
};

const onToggleCollapsableStatus = (dataType, value) => ({
    type: commonTypes.UPDATE_COLLAPSABLE_CONTAINER_STATUS,
    payload: { dataType,value }
});

const updateAllWorkoutPageName = (value) => ({
    type: commonTypes.UPDATE_ALL_WORKOUT_PAGE_NAME,
    payload: value
});

export { onToggleCollapsableStatus, updateAllWorkoutPageName };
