import serial
from datetime import datetime

PORT = '/dev/tty.usbmodem101'
BAUD = 9600

ser = serial.Serial(PORT, BAUD)

print("Listening for grip sessions...")

while True:
    try:
        data = ser.readline().decode().strip()

        if data.startswith("AVG:"):
            avg = float(data.replace("AVG:", ""))

            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            print(f"\nSession recorded at {timestamp}")
            print(f"Average Grip: {avg}%\n")

            # save to file
            with open("session_averages.csv", "a") as f:
                f.write(f"{timestamp},{avg}\n")

    except KeyboardInterrupt:
        print("\nStopped.")
        break

    except:
        pass