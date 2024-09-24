import development from "./development";
import stag from "./stag";
import prod from "./prod";

/* change the value of env to switch environments
  dev --> development 
  stag --> staging
  prod --> production
*/
const env = "prod";


export const envV2= env==="prod"?prod:development

export default (() => {
  switch (env) {
    case "dev":
      return development;
    case "stag":
      return stag;
    case "prod":
      return prod;
    default:
      return development;
  }
})();
