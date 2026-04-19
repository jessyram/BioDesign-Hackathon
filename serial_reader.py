import serial
from datetime import datetime

PORT = '/dev/tty.usbmodem101'
BAUD = 9600

ser = serial.Serial(PORT, BAUD)

print("Listening for sessions...")

start_time = None

while True:
    try:
        data = ser.readline().decode().strip()

        if data.startswith("AVG:"):
            avg = float(data.replace("AVG:", ""))

            end_time = datetime.now()

            duration = (end_time - start_time).total_seconds() if start_time else 0

            timestamp = end_time.strftime("%Y-%m-%d %H:%M:%S")

            print(f"{timestamp} | {avg} kg | {duration}s")

            with open("session_data.csv", "a") as f:
                f.write(f"{timestamp},{avg},{duration}\n")

            start_time = None

        elif data:
            if start_time is None:
                start_time = datetime.now()

    except KeyboardInterrupt:
        print("\nStopped.")
        break

    except:
        pass