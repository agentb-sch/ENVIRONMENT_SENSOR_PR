function powerI () {
    torch = 0
    strip = neopixel.create(DigitalPin.P1, 10, NeoPixelMode.RGB)
    strip.clear()
}
// P1> NEOPIXEL
// 
// P9-10> RESERVED
// 
// P2-3> lIGHT SENSOR
// 
// P4> LED
function data () {
    OLED.writeString("Pressure")
    OLED.writeNum(Environment.octopus_BME280(Environment.BME280_state.BME280_pressure))
    OLED.writeString("hPa")
    OLED.newLine()
    OLED.writeString("Humidity:")
    OLED.writeNum(Environment.octopus_BME280(Environment.BME280_state.BME280_humidity))
    OLED.writeString("%")
    OLED.newLine()
    OLED.writeString("Temperature:")
    OLED.newLine()
    OLED.writeNum(Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C))
    OLED.writeString("°C")
    OLED.newLine()
    OLED.writeStringNewLine("Dust level:")
    OLED.writeNum(Environment.ReadDust(DigitalPin.P9, AnalogPin.P10))
    OLED.writeString("μg/m³")
    OLED.newLine()
    OLED.writeString("Light intensity:")
    OLED.writeNum(Environment.ReadLightIntensity(AnalogPin.P2))
    OLED.writeString("%")
    basic.pause(1000)
    OLED.clear()
}
function torchlight () {
    if (torch == 0) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        Environment.ledBrightness(AnalogPin.P4, true, 100)
        torch = 1
    } else {
        Environment.ledBrightness(AnalogPin.P4, false, 0)
        basic.showLeds(`
            # . . . .
            . # . . .
            . . # . .
            . . . # #
            . . . # #
            `)
        torch = 0
    }
}
input.onButtonPressed(Button.B, function () {
    if (init == 1) {
        torchlight()
    }
})
function dust () {
    if (Environment.ReadDust(DigitalPin.P9, AnalogPin.P10) < 100) {
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
        basic.showLeds(`
            . . . . .
            . # . # .
            . . . . .
            # . . . #
            . # # # .
            `)
    } else {
        if (Environment.ReadDust(DigitalPin.P9, AnalogPin.P10) >= 101 && Environment.ReadDust(DigitalPin.P9, AnalogPin.P10) < 200) {
            strip.showColor(neopixel.colors(NeoPixelColors.Orange))
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                # # # # #
                . . . . .
                `)
        } else {
            if (Environment.ReadDust(DigitalPin.P9, AnalogPin.P10) >= 201 && Environment.ReadDust(DigitalPin.P9, AnalogPin.P10) < 300) {
                strip.showColor(neopixel.colors(NeoPixelColors.Red))
                basic.showLeds(`
                    . . . . .
                    . # . # .
                    . . . . .
                    . # # # .
                    # . . . #
                    `)
            } else {
                if (Environment.ReadDust(DigitalPin.P9, AnalogPin.P10) >= 300) {
                    strip.showColor(neopixel.colors(NeoPixelColors.White))
                    basic.showLeds(`
                        . . # . .
                        . . # . .
                        . . # . .
                        . . . . .
                        . . # . .
                        `)
                }
            }
        }
    }
}
let strip: neopixel.Strip = null
let torch = 0
let init = 0
init = 0
let LOAD = 0
OLED.init(128, 64)
powerI()
OLED.writeString("PUBLIC RELEASE")
while (LOAD < 100) {
    basic.showString("PUBLIC RELEASE")
    basic.showString("" + (control.deviceSerialNumber()))
}
OLED.newLine()
OLED.writeNum(control.deviceSerialNumber())
OLED.clear()
while (LOAD < 100) {
    OLED.drawLoading(LOAD)
    basic.pause(40)
    LOAD = LOAD + 1
}
init = 1
basic.clearScreen()
OLED.clear()
basic.forever(function () {
    if (init == 1) {
        data()
        dust()
    }
})
