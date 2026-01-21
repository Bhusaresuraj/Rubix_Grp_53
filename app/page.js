import Hero from "./Components/Hero";
import Map from "./Components/Map";
import CentralizedImpact from "./Components/CentralizedImpact";
import GovOversight from "./Components/GovOversight";
import OrgManagement from "./Components/OrgManagement";
import GreeningEngine from "./Components/GreeningEngine";
export default function Home() {
  return (
    <div><Hero/><CentralizedImpact/><GovOversight/><OrgManagement/><GreeningEngine/></div>
  );
}

export const metadata={
  title:"SEeyourC02!!!"
}