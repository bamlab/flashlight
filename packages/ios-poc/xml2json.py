#! /usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import argparse

parser = argparse.ArgumentParser(description='Convert an XML file to JSON.')
parser.add_argument('--unsafe', action='store_true',
                    help='do not use defusedxml: only for known-safe XML!')
parser.add_argument('infile', nargs='?', type=argparse.FileType('rt'),
                    default=sys.stdin)


def xml_element_to_dict(elem):
    "Convert XML Element to a simple dict"
    inner = dict(elem.attrib)
    children = list(map(xml_element_to_dict, list(elem)))
    text = elem.text and elem.text.strip()
    if text:
        inner['@text'] = text
    if children:
        inner['@children'] = children

    return {elem.tag: inner}


def main(args):
    "Dump JSON-from-parsed-XML to stdout"
    if args.unsafe:
        import xml.etree.ElementTree as ElementTree
    else:
        import defusedxml.ElementTree as ElementTree

    xml_parser = ElementTree.parse(args.infile)
    root = xml_parser.getroot()

    json.dump(xml_element_to_dict(root), sys.stdout, indent=2)
    print()


if __name__ == '__main__':
    args = parser.parse_args()
    main(args)
