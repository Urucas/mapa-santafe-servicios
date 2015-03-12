var app = new (function app() {
  
  var self = this;
  this.map;
  this.geocoper;
  this.container = document.getElementById("map-container");
  this.servicios = servicios;
  this.interval;
  this.servicios_json = [];

  this.getScreenSize = function() {
    return { 
      h: window.screen.availHeight,
      w: window.screen.availWidth
    }
  }

  this.initialize = function() {

    self.container.style.height = (self.getScreenSize().h)+"px";

    var mapOptions = {
      center: { lat:-32.9458328, lng: -60.6691576},
      zoom: 15,
      panControl: true,
      zoomControl: true,
      scaleControl: true
    };
    self.map = new google.maps.Map(self.container, mapOptions);

    self.geocoder = new google.maps.Geocoder();
    // self.getGeocodes();

    self.addMarkers();
    
  }

  this.addMarkers = function() {
    
    for(var i=0;i<self.servicios.length;i++) {
      var s = servicios[i];
      var marker = new google.maps.Marker({
        map: self.map,
        position: new google.maps.LatLng(s.location.lat, s.location.lng),
        title: s.type+ " - "+ s.address + " - "+ s.city
      });
    }  
  }

  this.getGeocodes = function() {
    self.interval = setInterval(function(){
      var s = self.getNextServicio();
      if(!s) {
        clearInterval(self.interval);
        console.log(JSON.stringify(self.servicios_json));
        return;
      }
      var addr = s[1] + ", "+ s[2]+", Santa Fe, Argentina";
      self.getGeo(addr, function(loc){
        if(!loc) return;
        self.servicios_json.push({
          "type": s[0],
          "address": s[1],
          "location": {
            "lat": loc.lat(),
            "lng": loc.lng()
          },
          "city": s[2]
        });
        
        var marker = new google.maps.Marker({
          map: self.map,
          position: loc
        });

      });
    }, 1000);
  }

  this.getNextServicio = function() {
    return self.servicios.length ? self.servicios.shift() : false;
  }

  this.getGeo = function(address, cb) {
    self.geocoder.geocode({ 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // map.setCenter(results[0].geometry.location);
        cb(results[0].geometry.location);
      } else {
        console.log(address+ " error: "+ status);
        cb(false);
      }
    });
  }

})();

app.initialize();  
