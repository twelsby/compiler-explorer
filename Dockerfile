FROM twelsby/docker-linux-dev:latest

LABEL maintainer="Trevor Welsby" \
      license="Copyright (c) 2012-2022, Matt Godbolt"

EXPOSE 10240

RUN echo "*** Installing Compiler Explorer ***" \
    && git clone https://github.com/compiler-explorer/compiler-explorer.git /compiler-explorer \
    && cd /compiler-explorer \
    && echo "export {LLVMTool} from './llvm-tool';" >> lib/tooling/_all.js \
    && npm run webpack \
    && npm run ts-compile

ADD llvm-tool.ts /compiler-explorer/lib/tooling/llvm-tool.ts
ADD cpp.properties /compiler-explorer/etc/config/c++.local.properties
ADD rust.properties /compiler-explorer/etc/config/rust.local.properties

WORKDIR /compiler-explorer

RUN echo "*** make run

ENTRYPOINT [ "make" ]

CMD ["run"]
