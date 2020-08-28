from scapy2dict import to_dict
from datetime import datetime
import requests
from pprint import pprint

source = "protocol-sniffer-01"


def get_filter(ip, protocol, port):

    filter = ""
    if ip:
        filter += "host " + ip
    if protocol:
        if ip:
            filter += " and " + protocol
        else:
            filter += protocol
        if port:
            filter += " port " + port

    return filter


def get_packets_from_capture(capture):

    packets = list()
    for packet in capture:
        packet_dict = to_dict(packet, strict=True)
        if "Raw" in packet_dict:
            del packet_dict["Raw"]
        packet_dict_no_bytes = bytes_to_string(packet_dict)
        packets.append(packet_dict_no_bytes)

        pprint(packet_dict_no_bytes)

    return packets


def send_capture(destination, serial_no, timestamp, packets):

    capture_payload = {
        "name": source,
        "serial": serial_no,
        "timestamp": timestamp,
        "packets": packets,
    }
    rsp = requests.post(
        "http://" + destination + ":5000/capture/store", json=capture_payload
    )
    if rsp.status_code != 200:
        print(
            f"{str(datetime.now())[:-3]}: Error calling /capture/store response: {rsp.status_code}, {rsp.content}"
        )


def bytes_to_string(data):

    if isinstance(data, dict):
        for k, v in data.items():
            data[k] = bytes_to_string(v)
        return data
    elif isinstance(data, list):
        for index, v in enumerate(data):
            data[index] = bytes_to_string(v)
        return data
    elif isinstance(data, tuple):
        data_as_list = list(data)
        for index, v in enumerate(data_as_list):
            data_as_list[index] = bytes_to_string(v)
        return tuple(data_as_list)
    elif isinstance(data, bytes):
        return data.decode("latin-1")

    else:
        return data