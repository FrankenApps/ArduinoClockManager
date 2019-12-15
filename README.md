# Wanduhr support files

This repository contains files needed to build a Wanduhr. The code for an ESP8266 (Wemos D1 mini) can be found in this [repository](https://github.com/FrankenApps/Wanduhr).

![Wanduhr (render)](https://raw.githubusercontent.com/FrankenApps/Wanduhr_support_files/master/images/Wanduhr.gif)

## Parts list
The parts needed to build this clock are:
1. A microcontroller (esp8266 or esp32 should be fine); preferably a `WEMOS D1 mini`
2. Four LED circle segments with 15 LEDs (*WS2812B*) each, you can get them from [adafruit](https://www.adafruit.com/product/2874).
3. Wood sheets with 4mm thickness and sufficient area 
   You can find the drawings needed for sawing out the parts in `CAD files -> Technical Drawings`
4. Wood glue, a soldering iron, a drilling machine and a jigsaw

If you would like to power the clock with a battery you will also need a `TP4056`, an `18650 battery holder` and an `18650 battery` (3.7 V).
In that case, don't forget to drill an extra hole for the usb plug.
