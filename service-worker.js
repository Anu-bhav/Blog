!function(){"use strict";const s=1625981823707,e="cache"+s,a=["client/index.b3434b9a.js","client/about.0233262f.js","client/index.912e9966.js","client/BackToTop.03655b1c.js","client/[slug].7a44c853.js","client/client.92aecc44.js"].concat(["service-worker-index.html","Bashed.assets/image-20210426050746209.png","Bashed.assets/image-20210426050947700.png","Bashed.assets/image-20210426051146905.png","Bashed.assets/image-20210426051313928.png","Bashed.assets/image-20210426051347480.png","Bashed.assets/image-20210426051413896.png","Bashed.assets/image-20210426051717761.png","Bashed.assets/image-20210426052146005.png","Bashed.assets/image-20210426052531204.png","Bashed.assets/image-20210426053142178.png","Bashed.assets/image-20210426053314010.png","Bashed.assets/image-20210426053359115.png","Bashed.assets/image-20210426053608498.png","Bashed.assets/image-20210426053953530.png","Bashed.assets/image-20210426054917421.png","Bashed.assets/image-20210426055043330.png","Bashed.assets/image-20210426060239676.png","Bashed.assets/image-20210426060250953.png","Bashed.assets/image-20210426061019511.png","Bashed.assets/image-20210426061419226.png","Bashed.assets/image-20210426061811213.png","Bashed.assets/image-20210426062713802.png","Bashed.assets/image-20210426063556805.png","Bashed.assets/image-20210426064607146.png","Bashed.assets/image-20210426064618710.png","Bashed.assets/image-20210426065148940.png","Beep.assets/image-20210429022801188.png","Beep.assets/image-20210429030531207.png","Beep.assets/image-20210429030535503.png","Beep.assets/image-20210429031035862.png","Beep.assets/image-20210429063246363.png","Beep.assets/image-20210429064303509.png","Beep.assets/image-20210429064305972.png","Beep.assets/image-20210429065104719.png","Beep.assets/image-20210429081050948.png","Beep.assets/image-20210429081222144.png","Beep.assets/image-20210429092550027.png","Beep.assets/image-20210429093007417.png","Beep.assets/image-20210429093138445.png","Beep.assets/image-20210429093521602.png","Beep.assets/image-20210429093541822.png","Beep.assets/image-20210429093742595.png","Beep.assets/image-20210429094839741.png","Beep.assets/image-20210429094839823.png","Beep.assets/image-20210429095234711.png","Brainfuck.assets/image-20210423092213672.png","Brainfuck.assets/image-20210423092517149.png","Brainfuck.assets/image-20210423092844295.png","Brainfuck.assets/image-20210423100221583.png","Brainfuck.assets/image-20210423100437959.png","Brainfuck.assets/image-20210423104514064.png","Brainfuck.assets/image-20210423104733666.png","Brainfuck.assets/image-20210423120100898.png","Brainfuck.assets/image-20210424055551012.png","Brainfuck.assets/image-20210424060021322.png","Brainfuck.assets/image-20210424060023915.png","Brainfuck.assets/image-20210424063117997.png","Brainfuck.assets/image-20210424063217601.png","Brainfuck.assets/image-20210424063910309.png","Brainfuck.assets/image-20210424064212334.png","Brainfuck.assets/image-20210424064603321.png","Brainfuck.assets/image-20210424064609386.png","Brainfuck.assets/image-20210424065221953.png","Brainfuck.assets/image-20210424065348596.png","Brainfuck.assets/image-20210424070158690.png","Brainfuck.assets/image-20210424070425913.png","Brainfuck.assets/image-20210424070431548.png","Brainfuck.assets/image-20210424070507569.png","Brainfuck.assets/image-20210424070539798.png","Brainfuck.assets/image-20210424070838384.png","Brainfuck.assets/image-20210424071528025.png","Brainfuck.assets/image-20210424072018596.png","Brainfuck.assets/image-20210424072421469.png","Brainfuck.assets/image-20210424073446093.png","Brainfuck.assets/image-20210424073724663.png","Brainfuck.assets/image-20210424074619202.png","Brainfuck.assets/image-20210424081016859.png","Brainfuck.assets/image-20210424083739076.png","Brainfuck.assets/image-20210424084309613.png","Brainfuck.assets/image-20210424084553996.png","Brainfuck.assets/image-20210424084857346.png","Brainfuck.assets/image-20210424085249183.png","Brainfuck.assets/image-20210424090253551.png","Brainfuck.assets/image-20210424105245632.png","Cronos.assets/image-20210429134408046.png","Cronos.assets/image-20210429141623055.png","Cronos.assets/image-20210429141923272.png","Cronos.assets/image-20210429142110168.png","Cronos.assets/image-20210429142346516.png","Cronos.assets/image-20210429142725304.png","Cronos.assets/image-20210429145546248.png","Cronos.assets/image-20210429150112820.png","Cronos.assets/image-20210429153151953.png","Cronos.assets/image-20210429153632588.png","Cronos.assets/image-20210429153956388.png","Cronos.assets/image-20210429154116336.png","Cronos.assets/image-20210429161104987.png","Cronos.assets/image-20210429161454130.png","Cronos.assets/image-20210429161557939.png","Lame.assets/image-20210423011216308.png","Lame.assets/image-20210423012631573.png","Lame.assets/image-20210423012632047.png","Lame.assets/image-20210423012633582.png","Lame.assets/image-20210423013342626.png","Lame.assets/image-20210423014359022.png","Lame.assets/image-20210423014424000.png","Lame.assets/image-20210423015025621.png","Lame.assets/image-20210423015029581.png","Lame.assets/image-20210423030247985.png","Lame.assets/image-20210423030333503.png","Lame.assets/image-20210423035130871.png","Lame.assets/image-20210423035311257.png","Lame.assets/image-20210423040537738.png","Lame.assets/image-20210423041046805.png","Lame.assets/image-20210423050552798.png","Lame.assets/image-20210423050643210.png","Lame.assets/image-20210423050855031.png","Lame.assets/image-20210423053621551.png","Lame.assets/image-20210423055920733.png","Lame.assets/image-20210423060155816.png","Lame.assets/image-20210423060412613.png","Lame.assets/image-20210423060516976.png","Lame.assets/image-20210423060921071.png","Nibbles.assets/image-20210426221145657.png","Nibbles.assets/image-20210426221319931.png","Nibbles.assets/image-20210426221502521.png","Nibbles.assets/image-20210426223306827.png","Nibbles.assets/image-20210426223956036.png","Nibbles.assets/image-20210426224823227.png","Nibbles.assets/image-20210426225010279.png","Nibbles.assets/image-20210426225731825.png","Nibbles.assets/image-20210426230421923.png","Nibbles.assets/image-20210426230436563.png","Nibbles.assets/image-20210426230732546.png","Nibbles.assets/image-20210426231013515.png","Nibbles.assets/image-20210426231810606.png","Nibbles.assets/image-20210426233216764.png","Nibbles.assets/image-20210426235230027.png","Nibbles.assets/image-20210426235348283.png","Nibbles.assets/image-20210426235710818.png","Nibbles.assets/image-20210427000705549.png","Nibbles.assets/image-20210427000953310.png","Nibbles.assets/image-20210427001449345.png","Nibbles.assets/image-20210427002323525.png","Nibbles.assets/image-20210427002522089.png","Nibbles.assets/image-20210427004215618.png","Nibbles.assets/image-20210427004934185.png","Nibbles.assets/image-20210427005056993.png","Nibbles.assets/image-20210427005421970.png","Shocker.assets/image-20210425225231743.png","Shocker.assets/image-20210425225657299.png","Shocker.assets/image-20210425225756592.png","Shocker.assets/image-20210425230223506.png","Shocker.assets/image-20210425230918395.png","Shocker.assets/image-20210425231530638.png","Shocker.assets/image-20210425231801722.png","Shocker.assets/image-20210425232500964.png","Shocker.assets/image-20210426000718594.png","Shocker.assets/image-20210426011418915.png","Shocker.assets/image-20210426011945515.png","Shocker.assets/image-20210426012413725.png","Shocker.assets/image-20210426012848841.png","Shocker.assets/image-20210426012904228.png","Shocker.assets/image-20210426013049169.png","Shocker.assets/image-20210426013227029.png","Shocker.assets/image-20210426013339340.png","as-logo2.ico","favicon.png","first-post-test.assets/image-20201204114358026.png","first-post-test.assets/image-20201204114507428.png","first-post-test.assets/image-20201204114537968.png","first-post-test.assets/image-20201204120909906.png","fonts/merriweather-latin-300.woff","fonts/merriweather-latin-300.woff2","fonts/merriweather-latin-300italic.woff","fonts/merriweather-latin-300italic.woff2","fonts/merriweather-latin-400.woff","fonts/merriweather-latin-400.woff2","fonts/merriweather-latin-400italic.woff","fonts/merriweather-latin-400italic.woff2","fonts/merriweather-latin-700.woff","fonts/merriweather-latin-700.woff2","fonts/merriweather-latin-700italic.woff","fonts/merriweather-latin-700italic.woff2","fonts/merriweather-latin-900.woff","fonts/merriweather-latin-900.woff2","fonts/merriweather-latin-900italic.woff","fonts/merriweather-latin-900italic.woff2","fonts/rubik-latin-300.woff","fonts/rubik-latin-300.woff2","fonts/rubik-latin-300italic.woff","fonts/rubik-latin-300italic.woff2","fonts/rubik-latin-400.woff","fonts/rubik-latin-400.woff2","fonts/rubik-latin-400italic.woff","fonts/rubik-latin-400italic.woff2","fonts/rubik-latin-500.woff","fonts/rubik-latin-500.woff2","fonts/rubik-latin-500italic.woff","fonts/rubik-latin-500italic.woff2","fonts/rubik-latin-700.woff","fonts/rubik-latin-700.woff2","fonts/rubik-latin-700italic.woff","fonts/rubik-latin-700italic.woff2","fonts/rubik-latin-900.woff","fonts/rubik-latin-900.woff2","fonts/rubik-latin-900italic.woff","fonts/rubik-latin-900italic.woff2","fonts.css","global.css","highlight.css","logo-192.png","logo-512.png","logo.png","manifest.json","pdf/Bashed.pdf","pdf/Beep.pdf","pdf/Brainfuck.pdf","pdf/Cronos.pdf","pdf/Lame.pdf","pdf/Nibbles.pdf","pdf/Shocker.pdf","profile-pic.png","rsz_florian-klauer-489-unsplash.jpg","second-post.assets/image-20201204134739137.png","second-post.assets/image-20201204140711864.png","testing.assets/image-20201204142831205.png","undraw-illustration.svg"]),i=new Set(a);self.addEventListener("install",s=>{s.waitUntil(caches.open(e).then(s=>s.addAll(a)).then(()=>{self.skipWaiting()}))}),self.addEventListener("activate",s=>{s.waitUntil(caches.keys().then(async s=>{for(const a of s)a!==e&&await caches.delete(a);self.clients.claim()}))}),self.addEventListener("fetch",e=>{if("GET"!==e.request.method||e.request.headers.has("range"))return;const a=new URL(e.request.url);a.protocol.startsWith("http")&&(a.hostname===self.location.hostname&&a.port!==self.location.port||(a.host===self.location.host&&i.has(a.pathname)?e.respondWith(caches.match(e.request)):"only-if-cached"!==e.request.cache&&e.respondWith(caches.open("offline"+s).then(async s=>{try{const a=await fetch(e.request);return s.put(e.request,a.clone()),a}catch(a){const i=await s.match(e.request);if(i)return i;throw a}}))))})}();
