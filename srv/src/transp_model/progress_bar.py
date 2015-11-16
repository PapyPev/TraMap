__author__ = 'kolovsky'
import sys

class Progress_bar:
    def __init__(self, maxvalue):
        self.maxvalue = maxvalue
        sys.stdout.write("\r%d%%" % 0)
        sys.stdout.flush()

    def go(self, i):
        sys.stdout.write("\r%d%%" % int(float(i)/self.maxvalue * 100))
        sys.stdout.flush()
        if int(float(i)/self.maxvalue * 100) == 100:
            sys.stdout.write("\r%d%%...Done!\n" % int(float(i)/self.maxvalue * 100))
