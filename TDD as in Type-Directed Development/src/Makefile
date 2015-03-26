all: standalone

lightweight: slides.md template.html
	pandoc -t dzslides \
		   --template template.html \
	       -s slides.md \
		   -o slides.html

standalone: slides.md template.html
	pandoc -t dzslides \
		   --self-contained \
		   --template template.html \
	       -s slides.md \
		   -o slides-standalone.html

clean:
	-rm slides.html
