const config={
    screens:{
        SignUpEmail:{
            path:"SignUpEmail/:userName",
            parse:{
                userName:(userName)=>`${userName}`,
            }
        }
    },
}
const linking={
    prefixes:["fitnessvwork://app"],
    config,
}
export default linking;