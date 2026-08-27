export interface GtaMapLocation {id:string;name:string;category:'city'|'nature'|'landmark';coordinates:[number,number];description:string;verified:false}
export const gtaMapLocations:GtaMapLocation[]=[
  {id:'vice-city-center',name:'Vice City Center (sample)',category:'city',coordinates:[-80.1918,25.7617],description:'Sample city marker used to demonstrate the map component. Not verified gameplay data.',verified:false},
  {id:'coastal-road',name:'Coastal Road (sample)',category:'landmark',coordinates:[-80.126,25.79],description:'Sample coastal marker. Replace with verified local data after release.',verified:false},
  {id:'wetlands',name:'Leonida Wetlands (sample)',category:'nature',coordinates:[-80.55,25.65],description:'Sample nature marker for filter and visited-state testing.',verified:false},
  {id:'southern-marina',name:'Southern Marina (sample)',category:'landmark',coordinates:[-80.17,25.69],description:'Sample marina marker, not a confirmed in-game location.',verified:false},
];
