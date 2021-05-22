import pandas as pd
import sys
from Bio import SeqIO
import json

def mapping_string(string_value, sequence):

	response = sequence.find(string_value)

	if response != -1:
		number_data = sequence.count(string_value)

		dict_value = {"positions": response, "coincidences":number_data}
		return dict_value
	else:
		return -1

def export_result_mapping(file_export, dict_responses):

	with open(file_export, 'w') as outfile:
		json.dump(dict_responses, outfile)

#params
string_map = sys.argv[1]#string to search
from_reader = int(sys.argv[2])#could be read from database and from fasta file
file_output = sys.argv[3]#save results

if from_reader == 1:#process search from fasta file
	
	#process fasta file
	fasta_seq = sys.argv[4]
	dict_response_array = []

	for record in SeqIO.parse(fasta_seq, "fasta"):

		id_sequence = record.id
		sequence = [residue for residue in record.seq]
		sequence = ''.join(map(str, sequence))

		dict_response_search = {"id_sequence":id_sequence}

		#search using method
		dict_response_search.update({"response_search":mapping_string(string_map, sequence)})
		dict_response_array.append(dict_response_search)

	#export result as json
	export_result_mapping(file_output, dict_response_array)

#else:

	#read JSON to search sequence with filter and copy paste the same process
	