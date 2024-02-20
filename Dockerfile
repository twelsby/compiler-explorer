FROM twelsby/docker-linux-dev:latest

LABEL maintainer="Trevor Welsby" \
      license="Copyright (c) 2012-2022, Matt Godbolt"

EXPOSE 10240

RUN echo "*** Installing Compiler Explorer ***" \
    && git clone https://github.com/compiler-explorer/compiler-explorer.git /compiler-explorer \
    && cd /compiler-explorer \
    && echo "export {LLVMTool} from './llvm-tool.js';" >> lib/tooling/_all.ts

ADD llvm-tool.ts /compiler-explorer/lib/tooling/llvm-tool.ts

RUN echo "*** Building Compiler Explorer ***" \
    && cd /compiler-explorer \
    && /usr/bin/npm install \
    && rm -rf node_modules/.cache/esm/* \
    && touch ./node_modules/.npm-updated \
    && /usr/bin/npm run webpack \
    && /usr/bin/npm run ts-compile

ADD cpp.properties /compiler-explorer/etc/config/c++.local.properties
ADD c.properties /compiler-explorer/etc/config/c.local.properties
ADD rust.properties /compiler-explorer/etc/config/rust.local.properties

WORKDIR /compiler-explorer

ENTRYPOINT [ "make" ]

CMD ["run"]
