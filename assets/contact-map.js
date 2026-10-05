(() => {
  const container=document.querySelector('#contact-map');
  if(!container||!window.L)return;
  const location=[Number(container.dataset.latitude),Number(container.dataset.longitude)];
  const map=L.map(container,{scrollWheelZoom:false}).setView(location,17);
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  }).addTo(map);
  const marker=L.divIcon({className:'cilab-map-marker',html:'<span aria-hidden="true"></span>',iconSize:[24,24],iconAnchor:[12,12],popupAnchor:[0,-14]});
  const popup=document.createElement('div');
  const title=document.createElement('strong');title.textContent='CILAB';
  const address=document.createElement('p');address.textContent=container.dataset.office;
  popup.append(title,address);
  L.marker(location,{icon:marker,title:container.dataset.office,alt:container.dataset.office}).addTo(map).bindPopup(popup).openPopup();
  const message=document.querySelector('#map-status');
  tiles.on('tileload',()=>{if(message)message.hidden=true;});
  tiles.on('tileerror',()=>{if(message&&!container.querySelector('.leaflet-tile-loaded')){message.hidden=false;message.textContent='지도를 불러오지 못했습니다. 아래 Google Maps 또는 Naver Map에서 위치를 확인해 주세요.';}});
})();
