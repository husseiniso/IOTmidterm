
//**************************************************************//
//  Name    : LED Quilt Controller, Siggraph                    //
//  Author  : Saman Tehrani                                     //
//  Date    : 17 July, 2015                                     //
//  Version : 1.0                                               //
//  Notes   : ...                                               //
//**************************************************************//

#include <SoftwareSerial.h>






#include <Servo.h>

int servoPin = 6;




Servo servo;

int angle = 0;
//
int temprature = 0;
int humidity = 0;
int light = 0;
bool systemState = false;


int photocellPin = 0;     
int photocellReading;     
int LEDpin = 11;          // connect Red LED to pin 11 (PWM pin)
int LEDbrightness;
int sensorPin = 2;
        
void setup(void) {
  
  Serial.begin(9600); 
  servo.attach(servoPin);
  servo.write(0);
  pinMode(3, OUTPUT);
  delay(1000);  
}
 
void loop(void) {
    if (Serial.available() > 0)
  {
    
    byte input = Serial.read();
    if( input == 'S' ) {
      systemState = true;
    }
    if( input == 'E' ) {
      systemState = false;
       
    }
    if( input == 'O' ){
      servo.write(180);
       delay(15);
    }
    if( input == 'C' ){
      servo.write(0);
       delay(15);
      
    }
  }
  if( systemState){
      photocellReading = analogRead(photocellPin);  
     int reading = analogRead(sensorPin);  
     
        float voltage = reading * 5.0;
     voltage /= 1024.0; 
    //Serial.print(voltage); Serial.println(" volts");
    
    float temperatureC = (voltage - 0.5) * 100 ;
      //Serial.print(temperatureC); Serial.println(" degrees C");
    char message1 [5];
      sprintf (message1,"T%04d", (int)temperatureC);
      Serial.write(message1);  
      float temperatureF = (temperatureC * 9.0 / 5.0) + 32.0;
     //Serial.print(temperatureF); Serial.println(" degrees F");
    
    
    
     //photocell
     // Serial.print("Analog reading = ");
      //Serial.println(photocellReading);     
      char message [5];
      sprintf (message,"L%04d", photocellReading);
      Serial.write(message);  
     
    
      
      photocellReading = 1023 - photocellReading;
      
      LEDbrightness = map(photocellReading, 0, 1023, 0, 255);
      analogWrite(LEDpin, LEDbrightness);
     
      delay(1000);
    }
}

   // servo position in degrees






