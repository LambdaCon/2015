all: clean compile

clean:
	@rm -rf ebin/*.beam

compile:
	@test -d ebin || mkdir ebin
	@erl -pa ebin -make

test:
	@escript test.escript

.PHONY: test


GEN_FILE=UnicodeData.txt
GEN_URL=http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
GEN_SRC=src/idna_unicode_data.erl.src
GEN_OUT=src/idna_unicode_data.erl

gen:
	@wget -qO $(GEN_FILE) $(GEN_URL)
	@cat $(GEN_SRC) \
		| head -n `grep -n "%% GENERATED" $(GEN_SRC) \
		| cut -d : -f 1` \
		> $(GEN_OUT)
	@cat $(GEN_FILE) \
		| awk 'BEGIN{FS=";"}{if($$6!=""){printf("decomposition(\"%s\") -> \
		\"%s\";\n", $$6, $$1)}}' \
		| sort \
		| uniq -w 25 \
		>> $(GEN_OUT)
	@echo "decomposition(_) -> false." >> $(GEN_OUT)
	@echo "" >> $(GEN_OUT)
	@cat $(GEN_FILE) \
		| awk 'BEGIN{FS=";"}{if($$1!=""){printf("lookup1(\"%s\") ->\
		{\"%s\",\"%s\",\"%s\"};\n", $$1, $$4, $$6, $$14)}}' \
		| sort \
		| uniq -w 25 \
		>> $(GEN_OUT)
	@echo "lookup1(_) -> false." >> $(GEN_OUT)
