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

        # 🔥 when Arduino sends final average
        if data.startswith("AVG:"):
            avg = float(data.replace("AVG:", ""))

            end_time = datetime.now()

            # calculate duration
            if start_time:
                duration = (end_time - start_time).total_seconds()
            else:
                duration = 0

            timestamp = end_time.strftime("%Y-%m-%d %H:%M:%S")

            print(f"{timestamp} | {avg} kg | {duration}s")

            # save to CSV
            with open("session_data.csv", "a") as f:
                f.write(f"{timestamp},{avg},{duration}\n")

            start_time = None

        elif data:
            # start session timing
            if start_time is None:
                start_time = datetime.now()

    except KeyboardInterrupt:
        print("\nStopped.")
        break

    except:
        pass