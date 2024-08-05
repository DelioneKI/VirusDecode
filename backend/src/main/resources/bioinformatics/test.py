import sys
import json

def string_to_json(input_string):
    # JSON 데이터 생성
    data = {
        "message": input_string
    }
    return data

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py <input_string>")
        sys.exit(1)

    input_string = sys.argv[1]
    result_json = string_to_json(input_string)

    # JSON 데이터를 문자열로 변환하여 출력
    print(json.dumps(result_json, indent=4))

if __name__ == "__main__":
    main()